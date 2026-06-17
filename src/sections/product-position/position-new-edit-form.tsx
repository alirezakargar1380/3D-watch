import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import { Avatar, Button, CardContent, CardHeader, Input, MenuItem, Portal, Stack, Tab, Table, TableBody, TableContainer, Tabs, TextField, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'src/components/snackbar';
import { UploadAvatar } from 'src/components/upload';
import FormProvider, {
  RHFEditor,
  RHFTextField,
  RHFMultiSelect,
  RHFSelect,
  RHFSwitch
} from 'src/components/hook-form';

import Card from '@mui/material/Card';
import { useCallback, useEffect, useMemo, useState } from "react";
import admin_axios, { endpoints } from "src/utils/axios";
import { LoadingButton } from "@mui/lab";
import { paths } from "src/routes/paths";
import { useRouter } from 'src/routes/hooks';
import { fData } from "src/utils/format-number";
import { IPosition } from "src/types/position";

// ----------------------------------------------------------------------

type Props = {
  currentData?: IPosition;
};

export default function PositionNewEditForm({ currentData }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<File | string>('');

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || '',
      x: currentData?.x || 0,
      y: currentData?.y || 0,
    }),
    [currentData]
  );

  const methods = useForm<any>({
    // resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentData) {
      reset(defaultValues);
    }
  }, [currentData, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let result
      if (currentData) {
        result = await admin_axios.patch(endpoints.positions.update(currentData.id), data).then((res) => res.data)
      } else {
        result = await admin_axios.post(endpoints.positions.create, data).then((res) => res.data)
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      console.info('result', result);
      enqueueSnackbar(currentData ? 'آپدیت شد' : 'ثبت شد');

      await uploadImage(result.id)
      // router.push(paths.dashboard.options.cover_type.root);

      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const uploadImage = async (id: number) => {
    const formData = new FormData();
    formData.append("file", avatarUrl)
    await admin_axios.patch(endpoints.positions.upload_icon(id), formData)
      .then(({ data }: any) => {
        // setValue("img", '')
      })
    enqueueSnackbar("آپلود انجام شد", {
      variant: 'info'
    })
  }

  const handleDropAvatar = useCallback(async (acceptedFiles: File[]) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setAvatarUrl(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
    // const formData = new FormData();
    // formData.append("file", newFile)
    // await admin_axios.patch(endpoints.positions.upload_icon(currentData?.id), formData)
    //   .then(({ data }: any) => {
    //     setValue("img", '')
    //   })
    // enqueueSnackbar("آپلود انجام شد", {
    //   variant: 'info'
    // })
  }, [currentData]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Card sx={{ width: 1 }}>
            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField
                name="name"
                label="نام"
              />
              <RHFTextField
                name="x"
                label="x"
                type='number'
              />
              <RHFTextField
                name="y"
                label="y"
                type='number'
              />
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}></Grid>
        <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Card sx={{ width: 1 }}>
            <CardHeader title="Icon" />
            <CardContent>
              <Avatar src={endpoints.positions.get_icon(currentData?.img || '')} />
              <UploadAvatar
                file={avatarUrl}
                onDrop={handleDropAvatar}
                validator={(fileData) => {
                  if (fileData.size > 1000000) {
                    return {
                      code: 'file-too-large',
                      message: `File is larger than ${fData(1000000)}`,
                    };
                  }
                  return null;
                }}
                onClick={() => { }}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={12} sx={{ display: 'flex', alignItems: 'center' }}>
          <LoadingButton type="submit" variant="contained" size="small" loading={isSubmitting}>
            {!currentData ? 'ثبت' : 'آپدیت'}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider >
  )
}