import { Button, FormControl, FormHelperText, FormLabel, IconButton, Input, Radio, RadioGroup, Slider, SvgIcon, Textarea, ToggleButtonGroup } from "@mui/joy";
import { useEffect, useState } from 'react'

import React from 'react'
import PropTypes from 'prop-types'
import { ToggleButton } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

export const ToggleButtonGroupSelection = ({ label, selections, fullWidth, state: [value, setValue] }: { label: string, selections: [{ name: string, value: string | number, description?: string, icon?: typeof SvgIcon | Object }], fullWidth: Boolean, state: [value: any, setValue: Function] }) => {
    return (
        <div className='space-y-3'>
            {label && <FormLabel className='mb-5'>{label}</FormLabel>}
            <ToggleButtonGroup
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                className={'shadow flex-row m-0' + (fullWidth && ' justify-stretch w-full')}
            >
                {selections.map((sel, idx) => {
                    return (
                        // <Button key={idx} value={sel.value} color={value === sel.value && "primary"} className={fullWidth && ' w-full'}
                        <Button key={idx} value={sel.value}  color={value === sel.value && "primary"} className={fullWidth && ' w-full'}
                        sx={{
                            color: "var(--joy-palette-neutral-softColor)",
                            // bgcolor: "var(--joy-palette-neutral-softBg)",
                            // bgcolor: value === sel.value ? "var(--joy-palette-primary-plainColor)" : "var(--joy-palette-neutral-outlinedBorder)",
                        }}
                        >
                            {sel.icon && <sel.icon />}
                            {sel.name}
                        </Button>
                    )
                })}
            </ToggleButtonGroup>
        </div>
    )
}

export const RadioGroupSelection = ({ label, selections, fullWidth, state: [value, setValue] }: { label: string, selections: [{ name: string, value: string | number, description?: string, icon?: typeof SvgIcon | Object }], fullWidth: Boolean, state: [value: any, setValue: Function] }) => {

    return (
        <>
            <div className='space-y-3'>
                {label && <FormLabel className='mb-5'>{label}</FormLabel>}
                <RadioGroup name="criteria" className={'flex-row space-x-2' + (fullWidth && ' justify-stretch')}>
                    {selections.map((sel, idx) => {
                        return (
                            <FormControl
                                className={'shadow rounded-xl flex-row border-solid border-2 p-2 space-x-2 min-w-6' + (fullWidth && ' w-full')}
                                sx={(theme) => ({ borderColor:  (value === sel.value) ? theme.vars.palette.primary.plainColor : theme.vars.palette.neutral.outlinedBorder})}
                                onClick={() => { setValue(sel.value) }}
                            >
                                <Radio
                                    key={idx}
                                    value={sel.value}
                                    checked={value === sel.value}
                                    onChange={() => setValue(sel.value)}
                                // disableIcon
                                />
                                <div className='flex flex-col space-y-0.5'>
                                    <FormLabel className='m-0'>
                                        {sel.icon && <sel.icon />}
                                        {sel.name}
                                    </FormLabel>
                                    {sel.description && <FormHelperText>{sel.description}</FormHelperText>}
                                </div>
                            </FormControl>
                        );
                    })}
                </RadioGroup>
            </div>
        </>
    )
}

export const RangeRatingSlider = ({ label, marks, state: [value, setValue] }: { label: string, marks: { value: number, label: string }[], state: [value: any, setValue: Function] }) => {
    return (
        <div className='mx-8'>
            <FormLabel>{label}</FormLabel>
            <Slider
                orientation="horizontal"
                valueLabelDisplay="auto"
                step={1}
                min={1}
                max={5}
                defaultValue={value}
                onChange={(event, value) => setValue(value as number)}
                marks={marks}
            />
        </div>
    )
}


export const ValidatedInput = ({
    name,
    placeholder,
    state: [value, setValue],
    formErrorsState: [formErrors, setFormErrors],
    validationRules
}: {
    name: string,
    placeholder: string,
    state: [value: string, setValue: Function],
    formErrorsState: [errors: string[], setErrors: Function],
    validationRules: { rule: Function, message: string }[]
}) => {
    return (
        <FormControl error={Boolean(formErrors[name].length)}>
            <Input placeholder={placeholder ?? name.charAt(0).toUpperCase() + name.slice(1)}
                value={value}
                onChange={
                    (e) => {
                        const fieldValue = e.target.value
                        const errors = []
                        for (const rule of validationRules) {
                            if (!rule.rule(fieldValue)) {
                                errors.push(rule.message)
                            }
                        }
                        setValue(fieldValue);
                        setFormErrors({ ...formErrors, [name]: errors })
                    }
                } />
            {formErrors[name].map((err) => {
                return (
                    <FormHelperText><InfoOutlined />{err}</FormHelperText>
                )
            })}
        </FormControl>
    )
}
export const ValidatedTextarea = ({
    name,
    placeholder,
    state: [value, setValue],
    formErrorsState: [formErrors, setFormErrors],
    validationRules
}: {
    name: string,
    placeholder: string,
    state: [value: string, setValue: Function],
    formErrorsState: [formErrors: string[], setFormErrors: Function],
    validationRules: { rule: Function, message: string }[]
}) => {
    return (
        <FormControl error={Boolean(formErrors[name].length)}>
            <Textarea placeholder={placeholder ?? name.charAt(0).toUpperCase() + name.slice(1)}
                value={value}
                minRows={2}
                onChange={
                    (e) => {
                        const fieldValue = e.target.value
                        const errors = []
                        for (const rule of validationRules) {
                            if (!rule.rule(fieldValue)) {
                                errors.push(rule.message)
                            }
                        }
                        setValue(fieldValue);
                        setFormErrors({ ...formErrors, [name]: errors })
                    }
                } />
            {formErrors[name].map((err) => {
                return (
                    <FormHelperText><InfoOutlined />{err}</FormHelperText>
                )
            })}
        </FormControl>
    )
}