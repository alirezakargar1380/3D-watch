import Button from '@mui/material/Button';
import { Theme, SxProps } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { PATH_AFTER_LOGIN } from 'src/config-global';
import SvgColor from 'src/components/svg-color';
import Badge, { badgeClasses } from '@mui/material/Badge';
import Label from 'src/components/label';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { paths } from 'src/routes/paths';
import { useCheckoutContext } from 'src/sections/checkout/context';
import { useEffect } from 'react';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useGetCart } from 'src/api/cart';
import WatchDemoViewer from 'src/sections/product/watch-item';
import Image from 'src/components/image';
import { customer_axios, endpoints } from 'src/utils/axios';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
    sx?: SxProps<Theme>;
};

export default function ShoppingCartButton({ sx }: Props) {
    const checkout = useCheckoutContext();

    const popover = usePopover();

    const { cart, refresh } = useGetCart();

    const handleRemoveItem = async (id: number) => {
        await customer_axios.delete(endpoints.cart.delete(id));
        refresh();
    }

    return (
        <>
            <Badge
                sx={{
                    [`& .${badgeClasses.badge}`]: {
                        top: 0,
                        right: 24,
                    },
                }}
                badgeContent={
                    <Label sx={{
                        p: 0,
                        pt: 0.50,

                        backgroundColor: "#000",
                        color: 'white',
                        borderRadius: '100%',
                        minWidth: 20,
                        height: 20,
                        ...(checkout.totalItems == 0 && {
                            display: 'none',
                        })
                    }}>
                        {checkout.totalItems}
                    </Label>
                }
            >
                <IconButton onClick={popover.onOpen}>
                    <Iconify icon={'mdi:shopping-outline'} />
                </IconButton>
            </Badge>
            <CustomPopover
                open={popover.open}
                arrow='top-right'
                transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                }}
                onClose={popover.onClose}
                sx={{ width: 304, mt: 0, mr: -5, p: '24px', height: 'fit-content', bgcolor: 'white' }}
            >
                <Scrollbar sx={{ maxHeight: 450 }}>
                    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} borderBottom={'1px solid #D1D1D1'} pb={'16px'}>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'end'} gap={'4px'} component={'div'}>
                            <Typography variant='body1'>Cart</Typography>
                            <Typography variant='body2' color={'#2B2B2B'}>({checkout.totalItems})</Typography>
                        </Box>
                        <IconButton onClick={popover.onClose}>
                            <SvgColor src="/assets/icons/navbar/x-close.svg" sx={{ width: 16, height: 16 }} />
                        </IconButton>
                    </Stack>
                    <Box sx={{ pb: '16px', borderBottom: '1px solid #D1D1D1', py: 2 }} component={'div'}>
                        {cart.map((item, index) => (
                            <Box component={'div'} key={index} mb={2} display={'flex'} justifyContent={'space-between'} alignItems={'end'}>
                                <Stack direction={'row'}>
                                    <Box component={'div'}>
                                        <Image borderRadius={1.2} src={endpoints.images.get(item.product.images?.find((img) => img.main === true)?.name || '')} width={60} />
                                    </Box>
                                    <Typography ml={1}>{item.product.name}</Typography>
                                    {/* <WatchDemoViewer
                                onClick={() => { }}
                                model_path={item.clock}
                                color={JSON.parse(item.colors)}
                                onGetColorKeys={() => { }}
                                zoom={1.5}
                            /> */}
                                </Stack>
                                <IconButton>
                                    <Iconify onClick={() => handleRemoveItem(item.id)} icon="solar:trash-bin-trash-bold" color={'#8b0b0b'} />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Scrollbar>

                <Box sx={{ textAlign: 'right', mt: '16px' }} component={'div'}>
                    <Button size='small' variant='contained' component={RouterLink} href={paths.product.checkout}>
                        View Cart
                    </Button>
                </Box>

            </CustomPopover>
        </>

    );
}
