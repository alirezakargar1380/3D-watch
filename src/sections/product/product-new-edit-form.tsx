import * as Yup from 'yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

import { IImage, IProductItem } from 'src/types/product';
import WatchDemoViewer from './watch-item';
import { Button, IconButton, MenuItem } from '@mui/material';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { MuiColorInput } from 'mui-color-input';
import { ColorPicker } from 'src/components/color-utils';
import { RoundedColorPicker } from 'src/components/color-utils/rounded-color-picker';
import { TabItem } from './product-tab-item';
import { MultiFilePreview } from 'src/components/upload';

// ----------------------------------------------------------------------
const clockPaths = [
  {
    path: '/models/golden-ring-clock.glb',
    zoom: 3
  },
  {
    path: '/models/mile-watch.glb',
    zoom: 2
  },
  {
    path: '/models/salib-clock.glb',
    zoom: 5
  },
  {
    path: '/models/wood clock.glb',
    zoom: 1
  },
  {
    path: '/models/ring steel clock.glb',
    zoom: 2
  },
  {
    path: '/models/black-without-glass.glb',
    zoom: 1
  },
  {
    path: '/models/steel-clock-2.glb',
    zoom: 3
  },
  {
    path: '/models/wall clock without frame.glb',
    zoom: 3
  },
  {
    path: '/models/sozani.glb',
    zoom: 3
  },
  {
    path: '/models/clock.glb',
    zoom: 3
  },
]
// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};

const tabDefaultValue = {
  tab_name: '',
  key: '',
  zoom: 2,
  x: 0,
  y: 10,
  z: 0,
  default_color: '#000',
  colors: [
    {
      code: '#000',
      material_name: '',
      roughness: '',
      all: false,
      objects: []
    }
  ]
}

export default function ProductNewEditForm({ currentProduct }: Props) {
  const [shape, setShapes] = useState([]);
  const [mainImage, setMainImage] = useState<number>(0);
  const [images, setImages] = useState<any>([]);
  const [currentImages, setCurrentImages] = useState<any>([]);
  const [materials, setMaterials] = useState<any>([]);
  const [objects, setObjects] = useState<string[]>([]);

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    clock: Yup.string().required('Name is required'),
    // images: Yup.array().min(1, 'Images is required'),
    // tags: Yup.array().min(2, 'Must have at least 2 tags'),
    // category: Yup.string().required('Category is required'),
    // price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    // description: Yup.string().required('Description is required'),
    // // not required
    // taxes: Yup.number(),
    // newLabel: Yup.object().shape({
    //   enabled: Yup.boolean(),
    //   content: Yup.string(),
    // }),
    // saleLabel: Yup.object().shape({
    //   enabled: Yup.boolean(),
    //   content: Yup.string(),
    // }),
    tabs: Yup.array().of(
      Yup.object().shape({
        tab_name: Yup.string(),
        key: Yup.string(),
        zoom: Yup.number(),
        x: Yup.number(),
        y: Yup.number(),
        z: Yup.number(),
        default_color: Yup.string(),
        colors: Yup.array().of(
          Yup.object().shape({
            code: Yup.string().required()
          })
        ).required('')
      })
    )
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      // description: currentProduct?.description || '',
      // subDescription: currentProduct?.subDescription || '',
      // images: currentProduct?.images || [],
      clock: currentProduct?.clock || '',
      //
      // code: currentProduct?.code || '',
      // sku: currentProduct?.sku || '',
      // price: currentProduct?.price || 0,
      // quantity: currentProduct?.quantity || 0,
      // priceSale: currentProduct?.priceSale || 0,
      // tags: currentProduct?.tags || [],
      // taxes: currentProduct?.taxes || 0,
      // gender: currentProduct?.gender || '',
      // category: currentProduct?.category || '',
      // colors: currentProduct?.colors || [],
      // sizes: currentProduct?.sizes || [],
      // newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      // saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },

      tabs: currentProduct?.tabs.map((tab) => {
        return {
          ...tab,
          objects: []
        }
      }) || [
          tabDefaultValue
        ]
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    control
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tabs',
  });

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      if (currentProduct) {
        await axiosInstance.patch(endpoints.product.update(currentProduct.id), data)
        await uploadMainImage(currentProduct.id)
      } else {
        const res = await axiosInstance.post(endpoints.product.create, data).then((res) => res.data)
        await uploadMainImage(res.id)
      }

      // router.push(paths.dashboard.product.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  // IMAGE
  useEffect(() => {
    const images = currentProduct?.images?.map((img: IImage | string, index: number) => {
      if (typeof img === "string") return ""
      if (img.main) setMainImage(index);
      return endpoints.images.get(img.name);
    })

    setCurrentImages(images)
  }, [currentProduct?.images])

  const uploadMainImage = (product_id: number) => {
    if (!images.length) return

    const form = new FormData()

    for (let i = 0; i < images.length; i++) {
      const element = images[i];
      form.append("file", element);
    }

    form.append("product_id", product_id.toString());
    form.append("main_image", mainImage.toString());

    return axiosInstance.put(endpoints.images.upload_single, form)
  }
  // const handleDrop = useCallback(
  //   (acceptedFiles: File[]) => {
  //     const files = values.images || [];

  //     const newFiles = acceptedFiles.map((file) =>
  //       Object.assign(file, {
  //         preview: URL.createObjectURL(file),
  //       })
  //     );

  //     setValue('images', [...files, ...newFiles], { shouldValidate: true });
  //   },
  //   [setValue, values.images]
  // );

  const handleSelectMainImage = useCallback(
    async (inputFile: number, selected: boolean) => {
      setMainImage(inputFile);

      if (selected) return

      if (!images.length && currentProduct?.images?.length) {
        await axiosInstance.put(endpoints.images.update_main_image, {
          product_id: currentProduct.id,
          file_id: currentProduct.images[inputFile].id
        })
        enqueueSnackbar("main image was updated")
      } else {
        console.log("condition was false", images, currentProduct)
      }
    },
    [setMainImage, currentProduct]
  );

  const handleAddTab = () => {
    append(tabDefaultValue)
  }

  // const handleRemoveFile = useCallback(
  //   (inputFile: File | string) => {
  //     const filtered = values.images && values.images?.filter((file) => file !== inputFile);
  //     setValue('images', filtered);
  //   },
  //   [setValue, values.images]
  // );

  // const handleRemoveAllFiles = useCallback(() => {
  //   setValue('images', []);
  // }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setMainImage(0)
      const customImages = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setImages(customImages);
      setMainImage(0);
      // setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, setImages, images]
  );

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Product Name" />

            <RHFTextField name="subDescription" label="Sub Description" multiline rows={4} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="description" />
            </Stack>

            <RHFUpload
              multiple
              onClick={() => { }}
              // thumbnail
              name=""
              maxSize={3145728}
              onDrop={handleDrop}
              // onRemove={handleRemoveFile}
              // onRemoveAll={handleRemoveAllFiles}
              onUpload={() => console.info('ON UPLOAD')}
              helperText="photo with green border is the main image"
            />

            {(images.length > 0) && (
              <Box sx={{ mb: 3 }} component={'div'}>
                <MultiFilePreview
                  files={images.length ? images : []}
                  thumbnail={true}
                  // onRemove={handleSelectHoverImage}
                  mainImage={mainImage}
                  onClick={handleSelectMainImage}
                />
              </Box>
            )}

            {(images.length === 0) && (
              <>
                <Typography>Current Product Image's</Typography>
                <Box component={'div'}>
                  <MultiFilePreview
                    files={currentImages}
                    thumbnail={true}
                    mainImage={mainImage}
                    onClick={handleSelectMainImage}
                  // onRemove={handleSelectHoverImage}
                  />
                </Box>
              </>
            )}

          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              component={'div'}
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="code" label="Product Code" />

              <RHFTextField name="sku" label="Product SKU" />

              <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              {/* <RHFSelect native name="category" label="Category" InputLabelProps={{ shrink: true }}>
                {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                  <optgroup key={category.group} label={category.group}>
                    {category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </RHFSelect> */}

              {/* <RHFMultiSelect
                checkbox
                name="colors"
                label="Colors"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              /> */}

              {/* <RHFMultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} /> */}
            </Box>

            {/* <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            {/* <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
            </Stack> */}

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel.enabled}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel.enabled}
              />
            </Stack> */}



            <Typography variant='subtitle2'>Customization Tabs</Typography>

            {fields.map((field, index) => (
              <TabItem
                key={index}
                index={index}
                shape={shape}
                objects={objects}
                materials={materials}
                control={control}
                setValue={setValue}
                values={values}
                removeTab={remove}
              />
            ))}

            <Button fullWidth={false} color='secondary' variant='contained' sx={{ width: 'fit-content' }} onClick={handleAddTab}>add Tab</Button>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Regular Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="priceSale"
              label="Sale Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
              label="Price includes taxes"
            />

            {!includeTaxes && (
              <RHFTextField
                name="taxes"
                label="Tax (%)"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderWatch = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Clock
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Select Your Clock.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Clock" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              component={'div'}
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              {clockPaths.map((clock: any) => {
                return (
                  <WatchDemoViewer
                    onClick={() => {
                      // if (currentProduct)
                      //   return enqueueSnackbar('just in creating a prodcut can select a clock', {
                      //     variant: 'error'
                      //   })
                      setValue('clock', clock.path)
                    }}
                    model_path={clock.path}
                    key={clock.path}
                    zoom={clock?.zoom}
                    selected={values.clock === clock.path}
                    onSendObjects={(objects) => {
                      (values.clock === clock.path) && setObjects(objects)
                    }}
                    onSendMaterials={(material) => {
                      (values.clock === clock.path) && setMaterials(material)
                    }}
                    onGetColorKeys={(colorObj: any) => {
                      (values.clock === clock.path) && setShapes(Object.keys(colorObj) as [])
                    }}
                  />
                )
              })}
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Create Product' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderWatch}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
