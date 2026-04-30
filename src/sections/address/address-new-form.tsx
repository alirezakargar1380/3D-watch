import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { countries } from 'src/assets/data';

import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { IAddressItem } from 'src/types/address';
import { customer_axios, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (address: IAddressItem) => void;
};

export default function AddressNewForm({ open, onClose, onCreate }: Props) {
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required('Fullname is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    // country: Yup.string().required('Country is required'),
    post_code: Yup.string().required('Zip code is required'),
    // not required
    // addressType: Yup.string(),
    // primary: Yup.boolean(),
  });

  const defaultValues = {
    name: '',
    city: '',
    state: '',
    address: '',
    post_code: '',
    // primary: true,
    phone: '',
    // addressType: 'Home',
    // country: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const address = await customer_axios.post(endpoints.address.create, data).then(({ data }) => data)
      console.log(address)
      onCreate({
        id: address.id,
        name: data.name,
        phone: data.phone,
        address: `${data.address}, ${data.city}, ${data.state}, ${data.post_code}`,
        city: data.city,
        state: data.state,
        primary: false,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>آدرس جدید</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            {/* <RHFRadioGroup
              row
              name="addressType"
              options={[
                { label: 'Home', value: 'Home' },
                { label: 'Office', value: 'Office' },
              ]}
            /> */}

            <Box
              component={'div'}
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="نام کامل تحویل گیرنده" />

              <RHFTextField name="phone" label="شماره تماس تحویل گیرنده" />
            </Box>

            <RHFTextField name="address" label="آدرس" />

            <Box
              component={'div'}
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="state" label="استان" />
              <RHFTextField name="city" label="شهر" />


              <RHFTextField name="post_code" label="کد پستی" />
            </Box>

            {/* <RHFAutocomplete
              name="country"
              label="Country"
              options={countries.map((country) => country.label)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => {
                const { code, label, phone } = countries.filter(
                  (country) => country.label === option
                )[0];

                if (!label) {
                  return null;
                }

                return (
                  <li {...props} key={label}>
                    <Iconify
                      key={label}
                      icon={`circle-flags:${code.toLowerCase()}`}
                      width={28}
                      sx={{ mr: 1 }}
                    />
                    {label} ({code}) +{phone}
                  </li>
                );
              }}
            /> */}

            {/* <RHFCheckbox name="primary" label="Use this address as default." /> */}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Deliver to this Address
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}