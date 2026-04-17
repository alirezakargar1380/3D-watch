import { DropzoneOptions } from 'react-dropzone';

import { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  sx?: SxProps<Theme>;
  thumbnail?: boolean;
  placeholder?: React.ReactNode;
  helperText?: React.ReactNode;
  disableMultiple?: boolean;
  //
  file?: CustomFile | string | null;
  onDelete?: VoidFunction;
  //
  files?: (File | string)[];
  mainImage?: number;
  onUpload?: VoidFunction;
  onClick: (index: number, selected: boolean) => void;
  onRemove?: (index: number, selected: boolean) => void;
  onRemoveAll?: VoidFunction;
}