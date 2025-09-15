package services

import (
	"fmt"
	"os/exec"
	"strings"
	"sync"
	"time"
)

// TTSManager quản lý trạng thái TTS để tránh đè lên nhau
type TTSManager struct {
	mu       sync.Mutex
	speaking bool
}

var ttsManager = &TTSManager{}

// StopCurrentSpeech dừng giọng nói hiện tại (chỉ Windows)
func StopCurrentSpeech() error {
	ttsManager.mu.Lock()
	defer ttsManager.mu.Unlock()

	// Dừng tất cả process SAPI đang chạy
	psScript := `
		Add-Type -AssemblyName System.Speech
		$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
		$synth.SpeakAsyncCancelAll()
		$synth.Dispose()
		
		# Kill powershell processes đang chạy TTS
		Get-Process powershell | Where-Object { $_.CommandLine -like "*SpeechSynthesizer*" } | Stop-Process -Force
	`
	cmd := exec.Command("powershell", "-Command", psScript)
	return cmd.Run()
}

func SpeakWindows(text string) error {
	ttsManager.mu.Lock()
	defer ttsManager.mu.Unlock()

	// Nếu đang nói, dừng giọng hiện tại
	if ttsManager.speaking {
		StopCurrentSpeech()
	}

	ttsManager.speaking = true
	defer func() { ttsManager.speaking = false }()

	// Làm sạch text để tránh lỗi injection
	cleanText := strings.ReplaceAll(text, "'", "''")
	cleanText = strings.ReplaceAll(cleanText, "`", "")

	// PowerShell script với cấu hình tối ưu cho tiếng Việt
	psScript := fmt.Sprintf(`
		Add-Type -AssemblyName System.Speech
		$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
		
		try {
			# Tìm giọng tiếng Việt tốt nhất
			$vietnameseVoices = $synth.GetInstalledVoices() | Where-Object { 
				$_.VoiceInfo.Culture.Name -like "*vi*" -or 
				$_.VoiceInfo.Name -like "*Vietnam*" -or 
				$_.VoiceInfo.Name -like "*Vietnamese*"
			}
			
			if ($vietnameseVoices.Count -gt 0) {
				# Ưu tiên giọng nữ nếu có
				$femaleVoice = $vietnameseVoices | Where-Object { $_.VoiceInfo.Gender -eq "Female" } | Select-Object -First 1
				if ($femaleVoice) {
					$synth.SelectVoice($femaleVoice.VoiceInfo.Name)
				} else {
					$synth.SelectVoice($vietnameseVoices[0].VoiceInfo.Name)
				}
			}
			
			# Cấu hình tốc độ và âm lượng để rõ ràng hơn
			$synth.Rate = -2      # Chậm hơn một chút để rõ ràng
			$synth.Volume = 90    # Âm lượng cao
			
			# Nói đồng bộ để tránh đè lên nhau
			$synth.Speak('%s')
		}
		finally {
			$synth.Dispose()
		}
	`, cleanText)

	cmd := exec.Command("powershell", "-Command", psScript)
	return cmd.Run()
}

// Linux TTS với cải tiến
func SpeakLinux(text string) error {
	ttsManager.mu.Lock()
	defer ttsManager.mu.Unlock()

	// Dừng espeak processes đang chạy
	if ttsManager.speaking {
		exec.Command("pkill", "-f", "espeak").Run()
		exec.Command("pkill", "-f", "festival").Run()
		time.Sleep(100 * time.Millisecond) // Đợi process dừng
	}

	ttsManager.speaking = true
	defer func() { ttsManager.speaking = false }()

	// Thử espeak với cấu hình tối ưu
	cmd := exec.Command("espeak",
		"-v", "vi", // Giọng tiếng Việt
		"-s", "150", // Tốc độ 150 WPM (từ/phút)
		"-p", "50", // Pitch trung bình
		"-a", "100", // Âm lượng tối đa
		"-g", "10", // Gap giữa các từ
		text)

	if err := cmd.Run(); err != nil {
		// Fallback: espeak không có giọng Việt
		cmd = exec.Command("espeak",
			"-s", "150",
			"-p", "50",
			"-a", "100",
			"-g", "10",
			text)
		if err := cmd.Run(); err != nil {
			// Fallback cuối cùng: festival
			cmd = exec.Command("festival", "--tts")
			cmd.Stdin = strings.NewReader(fmt.Sprintf("(SayText \"%s\")", text))
			return cmd.Run()
		}
	}
	return nil
}
