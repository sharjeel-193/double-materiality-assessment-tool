import { Stakeholder, CSVColumn } from '@/lib/types';

export const createCSV = (content: string, name: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', name);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export const downloadStakeholderMappingCSV = (stakeholders: Stakeholder[]) => {
    // Create CSV headers
    const headers = ['id', 'Name', 'Description', 'Influence', 'Impact'];
    
    // Create CSV rows with stakeholder data and empty influence/impact fields
    const csvRows = stakeholders.map(stakeholder => [
        stakeholder.id.toString(),
        `"${stakeholder.name.replace(/"/g, '""')}"`, // Escape quotes in name
        `"${stakeholder.description.replace(/"/g, '""')}"`, // Escape quotes in description
        '""', // Empty influence field
        '""'  // Empty impact field
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
    ].join('\n');

    createCSV(csvContent, 'stakeholder-mapping-for-analysts.csv')
};



export function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result.map(field =>
        field.startsWith('"') && field.endsWith('"') ? field.slice(1, -1) : field
    );
}

function parseValue(value: string, dataType: CSVColumn['dataType']): string | number | null {
    if (dataType === 'float') {
        const n = parseFloat(value);
        return isNaN(n) ? null : n;
    }
    if (dataType === 'integer') {
        const n = parseInt(value);
        return isNaN(n) ? null : n;
    }
    return value;
}

export function handleCSVFileUpload(
    file: File,
    selectedUploader: string,
    csvStructure: CSVColumn[],
    onUploadData: (uploader: string, data: Record<string, string | number>[]) => void,
    setUploadError: (msg: string) => void,
    setSuccessMessage: (msg: string) => void,
    resetSelectedUploader: (uploader: string) => void
) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const csv = e.target?.result as string;
            const lines = csv.split('\n').filter(line => line.trim());
            if (lines.length === 0) {
                setUploadError('CSV file is empty');
                return;
            }
            const headers = parseCSVLine(lines[0]).map(h => h.trim());

            const expectedLabels = csvStructure.map(col => col.label);
            if (!expectedLabels.every(label =>
                headers.some(h => h.toLowerCase() === label.toLowerCase())
            )) {
                setUploadError(`Invalid CSV format. Expected headers: ${expectedLabels.join(', ')}`);
                return;
            }

            const headerIndexMap: Record<string, number> = {};
            csvStructure.forEach(col => {
                for (let i = 0; i < headers.length; i++) {
                    if (headers[i].toLowerCase() === col.label.toLowerCase()) {
                        headerIndexMap[col.label] = i;
                        break;
                    }
                }
            });

            const parsedData: Record<string, string | number>[] = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                const values = parseCSVLine(line);
                if (values.length < headers.length) {
                    setUploadError(`Row ${i + 1} has insufficient columns. Expected ${headers.length} columns.`);
                    return;
                }
                const row: Record<string, string | number> = {};
                for(const col of csvStructure){
                    const idx = headerIndexMap[col.label];
                    if (idx === undefined || idx >= values.length) {
                        setUploadError(`Row ${i + 1} missing expected column ${col.label}`);
                        return;
                    }
                    const parsedVal = parseValue(values[idx], col.dataType);
                    if (parsedVal === null || parsedVal === undefined || (col.dataType !== 'string' && values[idx] === '')) {
                        setUploadError(`Row ${i + 1} column ${col.label} has invalid ${col.dataType} value: ${values[idx]}`);
                        return;
                    }
                    row[col.label] = parsedVal;
                }
                row['uploader'] = selectedUploader;
                parsedData.push(row);
            }
            if (parsedData.length === 0) {
                setUploadError('No valid data rows found in CSV file');
                return;
            }
            onUploadData(selectedUploader, parsedData);
            setSuccessMessage(`Successfully uploaded ${parsedData.length} rows for ${selectedUploader}`);
            setUploadError('');
            resetSelectedUploader('');
        } catch (error) {
            setUploadError('Error parsing CSV file. Please check the format.');
            console.error({ Error: error });
        }
    };
    reader.readAsText(file);
}
