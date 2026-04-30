import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { useBoolean } from 'src/hooks/use-boolean';

import { _addressBooks } from 'src/_mock';

import Iconify from 'src/components/iconify';

import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import { AddressItem, AddressNewForm } from '../address';
import { useGetAddress } from 'src/api/address';
import { IAddressItem } from 'src/types/address';
import { customer_axios, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {

  const { address, refresh } = useGetAddress();

  const checkout = useCheckoutContext();

  const addressForm = useBoolean();

  const handleDeliver = async (add_id: number) => {
    await customer_axios.patch(endpoints.address.primary(add_id))
    refresh();
  }

  const onCreateAddres = () => refresh();

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {address?.map((address: IAddressItem) => (
            <AddressItem
              key={address.id}
              addressItem={address}
              action={
                <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
                  {/* {!address.primary && (
                    <Button size="small" color="error" sx={{ mr: 1 }}>
                      Delete
                    </Button>
                  )} */}
                  <Button
                    variant="outlined"
                    size="small"
                    // onClick={() => checkout.onCreateBilling(address)}
                    onClick={() => {
                      handleDeliver(address.id)
                      checkout.onCreateBilling(address)
                    }}
                  >
                    به این آدرس ارسال شود
                  </Button>
                </Stack>
              }
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                boxShadow: (theme) => theme.customShadows.card,
              }}
            />
          ))}

          <Stack direction="row" justifyContent="space-between">
            <Button
              size="small"
              color="inherit"
              onClick={checkout.onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              back
            </Button>

            <Button
              size="small"
              color="primary"
              onClick={addressForm.onTrue}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              new address
            </Button>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={checkout.total}
            subTotal={checkout.subTotal}
            discount={checkout.discount}
          />
        </Grid>
      </Grid>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        onCreate={(data) => {
          onCreateAddres()
          checkout.onCreateBilling(data)
        }}
      />
    </>
  );
}