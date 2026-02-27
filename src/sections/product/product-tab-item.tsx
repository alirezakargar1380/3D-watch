import { Box, Button, IconButton, MenuItem, Stack } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { RoundedColorPicker } from "src/components/color-utils/rounded-color-picker";
import { RHFTextField } from "src/components/hook-form";

type TabItemProps = {
  index: number;
  control: any;
  shape: any;
  setValue: any;
  values: any;
  removeTab: (index: number) => void;
};

export const TabItem = ({
  index,
  control,
  shape,
  setValue,
  values,
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

            <IconButton onClick={() => removeColor(colorIndex)}>
              delete
            </IconButton>
          </Stack>
        ))}

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
  );
};