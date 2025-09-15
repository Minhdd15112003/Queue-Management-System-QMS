package types

// ExcelData struct để lưu trữ dữ liệu
type ExcelData struct {
	Header    []string                 `json:"headers"`
	Data      []map[string]interface{} `json:"data"`
	Counter   string                   `json:"counter"`
	TotalRows int                      `json:"totalRows"`
}

// ImportResult struct cho response
type ImportResult struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// ExportResult struct cho response
type ExportResult struct {
	Success  bool   `json:"success"`
	FilePath string `json:"filePath,omitempty"`
	Error    string `json:"error,omitempty"`
}

type DefaultData struct {
	Id             int    `json:"id"`
	PresentCounter int    `json:"headers"`
	Time           string `json:"time"`
	Status         string `json:"status"`
}
