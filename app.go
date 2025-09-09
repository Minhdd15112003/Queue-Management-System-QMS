package main

import (
	"CSM/types"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"time"

	"github.com/xuri/excelize/v2"
)

// App struct
type App struct {
	ctx context.Context
}

// Global variable để lưu data trong app
var currentExcelData *types.ExcelData

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Tạo thư mục data nếu chưa có
	dataDir := a.getDataDir()
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		fmt.Printf("Error creating data directory: %v\n", err)
	}

	// Load data có sẵn (nếu có)
	a.loadPersistedData()
}

// getDataDir trả về đường dẫn thư mục lưu trữ data
func (a *App) getDataDir() string {
	homeDir, _ := os.UserHomeDir()
	return filepath.Join(homeDir, ".excel-manager")
}

func (a *App) getExcelDir() string {
	if err := os.MkdirAll(filepath.Join(a.getDataDir(), "excel_files"), 0755); err != nil {
		fmt.Printf("Error creating data directory: %v\n", err)
	}

	return filepath.Join(a.getDataDir(), "excel_files")
}

// getDataFilePath trả về đường dẫn file data
func (a *App) getDataFilePath() string {
	return filepath.Join(a.getDataDir(), "current_data.json")
}

func (a *App) GetCurrentData() *types.ExcelData {
	return currentExcelData
}

func (a *App) ImportExcel(fileData string, filename string) types.ImportResult {
	data, err := base64.StdEncoding.DecodeString(fileData)
	if err != nil {
		return types.ImportResult{
			Success: false,
			Error:   fmt.Sprintf("Decode error: %v", err),
		}
	}
	//Tạo temporary file
	excelDir := a.getExcelDir()
	tmpFile := filepath.Join(excelDir, filename)

	err = ioutil.WriteFile(tmpFile, data, 0644)
	if err != nil {
		return types.ImportResult{
			Success: false,
			Error:   fmt.Sprintf("Write temp file error: %v", err),
		}
	}

	//Đọc Excel file
	f, err := excelize.OpenFile(tmpFile)
	if err != nil {
		return types.ImportResult{
			Success: false,
			Error:   fmt.Sprintf("Open Excel error: %v", err),
		}
	}
	defer f.Close()
	// Lấy sheet đầu tiên
	sheets := f.GetSheetList()
	if len(sheets) == 0 {
		return types.ImportResult{
			Success: false,
			Error:   "No sheets found in Excel file",
		}
	}

	sheetName := sheets[0]
	rows, err := f.GetRows(sheetName)
	if err != nil {
		return types.ImportResult{
			Success: false,
			Error:   fmt.Sprintf("Read rows error: %v", err),
		}
	}
	if len(rows) == 0 {
		return types.ImportResult{
			Success: false,
			Error:   "Excel file is empty",
		}
	}

	// Tạo ExcelData với headers dynamic
	headers := rows[0]   // Dòng đầu tiên là headers
	dataRows := rows[1:] // Các dòng còn lại là data

	// Convert sang format object array
	var result []map[string]interface{}

	for rowIndex, row := range dataRows {
		rowObject := make(map[string]interface{})
		rowObject["id"] = rowIndex + 1
		rowObject["time"] = time.Now().Local().Format("15:04")
		rowObject["counter"] = 1
		if rowIndex == 0 {
			rowObject["status"] = "serving" // Phần tử đầu tiên
		} else {
			rowObject["status"] = "waiting" // Các phần tử còn lại
		}
		for colIndex, header := range headers {
			var cellValue interface{}

			if colIndex < len(row) {
				cellValue = row[colIndex]
			} else {
				cellValue = ""

			}

			rowObject[header] = cellValue
		}

		result = append(result, rowObject)
	}
	// Lưu vào global variable
	currentExcelData = &types.ExcelData{
		Header:    headers,
		Data:      result,
		Counter:   "3/5",
		TotalRows: len(dataRows),
	}

	//Presist data to file
	err = a.persistData(currentExcelData)
	if err != nil {
		fmt.Printf("Warning: Could not persist data: %v\n", err)
	}
	fmt.Printf("Excel imported successfully: %d rows, %d columns\n", len(dataRows), len(headers))

	return types.ImportResult{
		Success: true,
		Data:    currentExcelData.Data,
	}
}

// persistData lưu data vào file
func (a *App) persistData(data *types.ExcelData) error {
	jsonData, err := json.MarshalIndent(data, "", " ")
	if err != nil {
		return err
	}
	dataFile := a.getDataFilePath()
	return ioutil.WriteFile(dataFile, jsonData, 0644)
}

// loadPersistedData load data từ file
func (a *App) loadPersistedData() {
	dataFile := a.getDataFilePath()
	if _, err := os.Stat(dataFile); os.IsNotExist(err) {
		fmt.Println("File không tồn tại: ", err)
		return // File không tồn tại
	}

	jsonData, err := ioutil.ReadFile(dataFile)
	if err != nil {
		fmt.Printf("Error reading persisted data: %v\n", err)
		return
	}
	var data *types.ExcelData
	err = json.Unmarshal(jsonData, &data)
	if err != nil {
		fmt.Printf("Error parsing persisted data: %v\n", err)
		return
	}

	currentExcelData = data
	fmt.Printf("Loaded persisted data: %d rows\n", len(data.Data))
}

// GetHeaders lấy headers hiện tại
func (a *App) GetHeaders() []string {
	if currentExcelData == nil || len(currentExcelData.Data) == 0 {
		return []string{}
	}

	var headers []string
	for key := range currentExcelData.Data[0] {
		headers = append(headers, key)
	}
	return headers
}
