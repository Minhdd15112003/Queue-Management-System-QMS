package services

import (
	"fmt"
	"strconv"
	"time"

	"github.com/xuri/excelize/v2"
)

type SheetData struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Status  string `json:"status"`
	Counter string `json:"counter"`
	Time    string `json:"time"`
}

func FormatSheetData(rows [][]string) []SheetData {
	var sheetData []SheetData

	for i, row := range rows {

		if i > 0 {
			data := SheetData{}
			// if len(row) > 0 {
			data.Id = fmt.Sprint(i)
			// }
			if len(row) > 0 {
				data.Name = row[0]
			}
			if len(row) > 1 {
				data.Status = row[1]
			}

			if len(row) > 2 {
				if counter, err := strconv.Atoi(row[2]); err == nil {
					data.Counter = strconv.Itoa(counter)
				}
			}

			data.Time = time.Now().Local().Format("15:04")

			sheetData = append(sheetData, data)
		}
	}
	return sheetData
}

type ExcelManager struct {
	File      *excelize.File
	SheetName string
	Headers   []string
}
