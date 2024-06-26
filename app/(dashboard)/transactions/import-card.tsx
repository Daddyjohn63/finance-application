import { useState } from 'react';
import { format, parse } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { convertAmountToMiliunits } from '@/lib/utils';
import { ImportTable } from './import-table';

//import { ImportTable } from './import-table';

//required formats
//const dateFormat = 'yyyy-MM-dd HH:mm:ss'; //what we need to get from the csv file
const dateFormat = 'dd/MM/yyyy HH:mm';
const outputFormat = 'yyyy-MM-dd'; //what our db expects.

const requiredOptions = ['amount', 'date', 'payee']; //needed/required to make a transaction

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

  const headers = data[0]; //first array is the header labels
  const body = data.slice(1); //now the transaction data

  const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumns(prev => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }
      if (value === 'skip') {
        value = null;
      }
      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split('_')[1];
    };

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map(row => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });
          //check
          return transformedRow.every(item => item === null) ? [] : transformedRow;
        })
        .filter(row => row.length > 0)
    };

    //console.log({ mappedData });
    const arrayOfData = mappedData.body.map(row => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }
        return acc;
      }, {});
    });
    // console.log({ arrayOfData });
    const formattedData = arrayOfData.map(item => ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount)),
      date: format(parse(item.date, dateFormat, new Date()), outputFormat)
    }));
    //console.log({formattedData});
    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Import Transaction</CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button onClick={onCancel} size="sm" className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleContinue}
              className="w-full lg:w-auto"
              disabled={progress < requiredOptions.length}
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers} //table headers
            body={body} //the table data
            selectedColumns={selectedColumns} //some state
            onTableHeadSelectChange={onTableHeadSelectChange} // a function to change the selected columns based on information coming from the table heade select.
          />
        </CardContent>
      </Card>
    </div>
  );
};
