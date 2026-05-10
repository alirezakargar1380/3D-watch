import { Box, Button, Divider, IconButton, ListItem, MenuItem, Stack, Typography } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { ColorPicker } from "src/components/color-utils";
import { RoundedColorPicker } from "src/components/color-utils/rounded-color-picker";
import { RHFCheckbox, RHFMultiSelect, RHFSelect, RHFTextField } from "src/components/hook-form";
import { Material } from "three";

type TabItemProps = {
  index: number;
  control: any;
  shape: any;
  setValue: any;
  values: any;
  materials: any[];
  objects: any[];
  removeTab: (index: number) => void;
};

export const TabItem = ({
  index,
  control,
  shape,
  setValue,
  values,
  materials,
  objects,
  removeTab
}: TabItemProps) => {

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor
  } = useFieldArray({
    control,
    name: `tabs.${index}.colors`
  });

  return (
    <>
      <Box my={6} component={'div'}>
        <Stack spacing={2}>

          <RHFTextField name={`tabs.${index}.tab_name`} label="Tab Name" />

          <RHFTextField name={`tabs[${index}].key`} label='Key' select>
            {shape.map((shaneName: string) => (
              <MenuItem key={shaneName} value={shaneName}>{shaneName}</MenuItem>
            ))}
          </RHFTextField>

          <RHFTextField name={`tabs.${index}.zoom`} label="Zoom" />

          <Stack direction="row" spacing={2}>
            <RHFTextField name={`tabs.${index}.x`} label="X" />
            <RHFTextField name={`tabs.${index}.y`} label="Y" />
            <RHFTextField name={`tabs.${index}.z`} label="Z" />
          </Stack>

          {colorFields.map((color, colorIndex) => (
            <Stack
              key={color.id}
              direction="row"
              justifyContent="space-between"
            >
              <Box component={'div'}>
                <RoundedColorPicker
                  value={
                    values?.tabs?.[index]?.colors?.[colorIndex]?.code || "#000"
                  }
                  onChange={(color) =>
                    setValue(
                      `tabs.${index}.colors.${colorIndex}.code`,
                      color
                    )
                  }
                />
              </Box>

              <Box component={'div'}>
                <RHFSelect name={`tabs.${index}.colors.${colorIndex}.material_name`} size="small">
                  <MenuItem value={''}>no one</MenuItem>
                  {materials.map((mt: any, index: number) => (
                    <MenuItem
                      key={index}
                      value={mt.name}
                    >
                      {mt.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Box>

              <RHFTextField name={`tabs.${index}.colors.${colorIndex}.roughness`} sx={{ width: 80 }} size="small" />

              <Box component={'div'}>
                <RHFMultiSelect
                  size="small"
                  name={`tabs.${index}.colors.${colorIndex}.objects`}
                  options={objects.map((ob) => {
                    return {
                      label: ob,
                      value: ob
                    }
                  })}
                />
              </Box>


              <RHFCheckbox name={`tabs.${index}.colors.${colorIndex}.all`} label='Apply For All' />

              <IconButton onClick={() => removeColor(colorIndex)}>
                ❌
              </IconButton>
            </Stack>
          ))}

          <Typography>Default Color :</Typography>
          <ColorPicker
            selected={values?.tabs?.[index]?.default_color || ''}
            onSelectColor={(color) =>
              setValue(
                `tabs.${index}.default_color`,
                color
              )
            }
            colors={colorFields.map((color, colorIndex) => {
              return values?.tabs?.[index]?.colors?.[colorIndex]?.code
            })}
          />

          <Button
            variant="outlined"
            onClick={() => appendColor({ code: "#000000" })}
          >
            Add Color
          </Button>

          <Button color="error" onClick={() => removeTab(index)}>
            Delete Tab
          </Button>

        </Stack>


      </Box>
      <Divider />
    </>
  );
};