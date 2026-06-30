import { useEffect, useCallback, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency, fShortenNumber } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ColorPicker } from 'src/components/color-utils';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { IFontFunction, IProductItem, IProductTabs } from 'src/types/product';
import { ICheckoutItem } from 'src/types/checkout';

import IncrementerButton from './common/incrementer-button';
import Viewer from './watch';
import { ReturnType, useBoolean } from 'src/hooks/use-boolean';
import axiosInstance, { customer_axios, endpoints } from 'src/utils/axios';
import CustomazationDialog from './watch';
import { FontPositions, fonts, FontSizes, IFont } from 'src/utils/fonts';
import Image from 'src/components/image';
import { IPosition } from 'src/types/position';
import { MotionContainer, varFade, varSlide } from 'src/components/animate';
import { m } from 'framer-motion';

// ----------------------------------------------------------------------

type Props = {
  dialog: ReturnType;
  product: IProductItem;
  items?: ICheckoutItem[];
  disabledActions?: boolean;
  onGotoStep?: (step: number) => void;
  onAddCart?: (cartItem: ICheckoutItem) => void;
  onSendColorObj: (obj: any) => void;
  onSendText: (font: IFontFunction) => void;
};

export default function ProductDetailsSummary({
  dialog,
  items,
  product,
  onAddCart,
  onGotoStep,
  onSendColorObj,
  disabledActions,
  onSendText,
  ...other
}: Props) {
  const router = useRouter();

  const {
    id,
    name,
    positions,
    // sizes,
    // price,
    // coverUrl,
    // colors,
    // newLabel,
    // available,
    // priceSale,
    // saleLabel,
    // totalRatings,
    // totalReviews,
    // inventoryType,
    // subDescription,
  } = product;

  const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  const [position, setPosition] = useState<IPosition>();
  const [index, setIndex] = useState<number>();

  const isMaxQuantity =
    !!items?.length

  const defaultValues = {
    // id,
    // name,
    // coverUrl,
    // available,
    // price,
    currentColorObject: {} as any,
    positions: positions.map((position: any) => {
      return {
        text: 'random t',
        font_file: fonts[0].file,
        font_size: FontSizes[0],
        ...position.position,
        p_id: position.position.id,
        x: position.x,
        y: position.y,
      }
    }),
    font_file: fonts[0].file,
    font_size: FontSizes[0],
    clock: product.clock,
    product: { id },
    colors: "#fff",
    size: 15,
    quantity: 6,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, control, setValue, handleSubmit } = methods;

  const values = watch();
  const positions_w = watch('positions');

  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control,
    name: `positions`
  });

  useEffect(() => {
    onSendText({
      font_file: values.font_file,
      font_size: values.font_size,
      positions: positions_w,
    })
  }, [values.font_file, values.font_size, JSON.stringify(positions_w)])

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('order data:', data)
      await customer_axios.post(endpoints.cart.create, data)
      // if (!existProduct) {
      //   onAddCart?.({
      //     ...data,
      //     colors: [values.colors],
      //     subTotal: data.price * data.quantity,
      //   });
      // }
      // onGotoStep?.(0);
      // router.push(paths.product.checkout);
    } catch (error) {
      console.error(error);
    }
  });

  const handleAddCart = useCallback(() => {
    try {
      console.log(values)
    } catch (error) {
      console.error(error);
    }
  }, [onAddCart, values]);

  useEffect(() => {
    onSendColorObj(values.currentColorObject)
  }, [values.currentColorObject])

  const renderPrice = (
    <Box sx={{ typography: 'h5' }} component={'div'}>
      {/* {priceSale && (
        <Box
          component="span"
          sx={{
            color: 'text.disabled',
            textDecoration: 'line-through',
            mr: 0.5,
          }}
        >
          {fCurrency(priceSale)}
        </Box>
      )} */}

      {fCurrency(15000)}
    </Box>
  );

  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: 'text.secondary',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );

  const renderColorOptions = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Color
      </Typography>

      {product.tabs.map((tab: IProductTabs, index: number) => {
        if (index === 0)
          return (
            // <Controller
            //   name="colors"
            //   control={control}
            //   render={({ field }) => (
            <ColorPicker
              colors={tab.colors.map((color) => color.code)}
              selected={values.currentColorObject[tab.tab_name] || ''}
              onSelectColor={(color) => setValue('currentColorObject', {
                [tab.tab_name]: color
              })
              }
              limit={4}
            />

            // />
          )
        // return (
        //   <>{tab.colors.map((color) => color.code)}</>
        // )
      })}
      {/* <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <ColorPicker
            colors={["#fff", "#F234dc"]}
            selected={field.value}
            onSelectColor={(color) => field.onChange(color as string)}
            limit={4}
          />
        )}
      /> */}
    </Stack>
  );

  const renderText = (
    <>

      <Box component={'div'}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1, mb: 2 }}>
          Typography
        </Typography>
        <Stack direction="row" spacing={1}>
          {fields.map((pos: any, index) => (
            <Box
              component={'div'}
              onClick={() => {
                setPosition(pos)
                setIndex(index)
              }}
              key={index * 324}
              sx={{
                width: 64, textAlign: 'center', borderRadius: 1.25, p: 1,
                border: '2px solid #e6e6e6',
                ...(pos.id === position?.id && {
                  border: '2px solid #858585',
                }),
                cursor: 'pointer'
              }}>
              <Image src={endpoints.positions.get_icon(pos.img)} sx={{ width: 0.7 }} />
              <Typography textAlign={'center'} variant='caption'>{pos.name}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {position && (
        <m.div key={`${position?.id}-text`} variants={varSlide({ durationOut: 5000, durationIn: 0.9 }).inDownFade}>
          <Stack direction="row" spacing={1}>
            <RHFTextField label='Text' name={`positions.${index}.text`} size='small' />

            <RHFSelect
              name={`positions.${index}.font_file`}
              label="font"
              size="small"
              sx={{
                maxWidth: 150,
                [`& .${formHelperTextClasses.root}`]: {
                  mx: 0,
                  mt: 1,
                  textAlign: 'right',
                },
              }}
            >
              {fonts.map((font: IFont, index: number) => (
                <MenuItem key={index} value={font.file}>
                  {font.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect
              name={`positions.${index}.font_size`}
              size="small"
              label="font size"
              sx={{
                maxWidth: 150,
                [`& .${formHelperTextClasses.root}`]: {
                  mx: 0,
                  mt: 1,
                  textAlign: 'right',
                },
              }}
            >
              {FontSizes.map((size: number, index: number) => (
                <MenuItem key={index} value={size}>
                  {size}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </m.div>
      )}
    </>
  );

  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={values.quantity}
          disabledDecrease={values.quantity <= 1}
          disabledIncrease={values.quantity >= 5}
          // disabledIncrease={values.quantity >= available}
          onIncrease={() => setValue('quantity', 6 + 1)}
          // onIncrease={() => setValue('quantity', values.quantity + 1)}
          onDecrease={() => setValue('quantity', 4 - 1)}
        // onDecrease={() => setValue('quantity', values.quantity - 1)}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {5}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        // disabled={isMaxQuantity || disabledActions}
        size="large"
        color="warning"
        variant="contained"
        onClick={dialog.onTrue}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Customize Clock
      </Button>
      {/* <Button
        fullWidth
        // disabled={isMaxQuantity || disabledActions}
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Add to Cart
      </Button>
      <Button
        fullWidth
        size="large"
        // type="submit" 
        variant="contained" onClick={dialog.onTrue} disabled={disabledActions}>
        Customize Clock
      </Button> */}
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {/* {subDescription} */}
      This is one of our best clock's
    </Typography>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: 'text.disabled',
        typography: 'body2',
      }}
    >
      <Rating size="small" value={5000} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(5000)} reviews)`}
    </Stack>
  );

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack direction="row" alignItems="center" spacing={1}>
  //     {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
  //     {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
  //   </Stack>
  // );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          // (inventoryType === 'out of stock' && 'error.main') ||
          // (inventoryType === 'low stock' && 'warning.main') ||
          'success.main',
      }}
    >
      {'low stock'}
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box component={MotionContainer}>

        <Stack spacing={3} {...other}>
          <Stack spacing={2} alignItems="flex-start">
            {/* {renderLabels} */}

            {renderInventoryType}

            <Typography variant="h5">{name}</Typography>

            {renderRating}

            {renderPrice}

            {renderSubDescription}
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {renderQuantity}

          {renderColorOptions}

          {renderText}

          <Divider sx={{ borderStyle: 'dashed' }} />

          {renderActions}

          <CustomazationDialog
            dialog={dialog}
            model_path={product.clock}
            tabs={product.tabs}
            values={values}
            textFields={fields}
            colorObject={values.currentColorObject}
          // afterSubmit={(object: any) => {
          //   setValue('colors', JSON.stringify(object))
          //   onSubmit();
          // }}
          />

          {renderShare}
        </Stack>
      </Box>
    </FormProvider>
  );
}
