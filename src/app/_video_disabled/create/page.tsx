"use client";

import { Autocomplete, Box, MenuItem, Select, TextField } from "@mui/material";
import { Create, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import Cookies from "js-cookie";
import { Controller } from "react-hook-form";

export default function BlogPostCreate() {
    const {
        saveButtonProps,
        refineCore: { formLoading, onFinish },
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm({});

    const { autocompleteProps: categoryAutocompleteProps } = useAutocomplete({
        resource: "video",
        meta: {
            headers: {
                Authorization: "Bearer " + Cookies.get("auth"),
            },
        },
    });

    return (
        <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column" }}
                autoComplete="off"
            >
                <TextField
                    {...register("title", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.title}
                    helperText={(errors as any)?.title?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={"Title"}
                    name="title"
                />
                <TextField
                    {...register("content", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.content}
                    helperText={(errors as any)?.content?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    multiline
                    label={"Content"}
                    name="content"
                />
                <Controller
                    control={control}
                    name={"category.id"}
                    rules={{ required: "This field is required" }}
                    // eslint-disable-next-line
                    defaultValue={null as any}
                    render={({ field }) => (
                        <Autocomplete
                            {...categoryAutocompleteProps}
                            {...field}
                            onChange={(_, value) => {
                                field.onChange(value.id);
                            }}
                            getOptionLabel={(item) => {
                                return (
                                    categoryAutocompleteProps?.options?.find(
                                        (p) => {
                                            const itemId =
                                                typeof item === "object"
                                                    ? item?.id?.toString()
                                                    : item?.toString();
                                            const pId = p?.id?.toString();
                                            return itemId === pId;
                                        }
                                    )?.title ?? ""
                                );
                            }}
                            isOptionEqualToValue={(option, value) => {
                                const optionId = option?.id?.toString();
                                const valueId =
                                    typeof value === "object"
                                        ? value?.id?.toString()
                                        : value?.toString();
                                return (
                                    value === undefined || optionId === valueId
                                );
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={"Category"}
                                    margin="normal"
                                    variant="outlined"
                                    error={!!(errors as any)?.category?.id}
                                    helperText={
                                        (errors as any)?.category?.id?.message
                                    }
                                    required
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => {
                        return (
                            <Select
                                {...field}
                                value={field?.value || "draft"}
                                label={"Status"}
                            >
                                <MenuItem value="draft">Draft</MenuItem>
                                <MenuItem value="published">Published</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                        );
                    }}
                />
            </Box>
        </Create>
    );
}
