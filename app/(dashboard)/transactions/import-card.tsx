import { useState } from 'react';
import { format, parse } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { convertAmountToMiliunits } from '@/lib/utils';

//import { ImportTable } from './import-table';

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  return <div>Import Card</div>;
};
