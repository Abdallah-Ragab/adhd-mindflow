'use client'
import * as React from 'react';

import {
    createTheme as getMaterialTheme,
    CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID,
    useColorScheme as useMaterialColorScheme,
    ThemeProvider as MaterialThemeProvider,
    Experimental_CssVarsProvider as ExpMaterialCssVarsProvider,
} from '@mui/material/styles';

import {
    CssVarsProvider as JoyCssVarsProvider,
    extendTheme as getJoyTheme,
    useColorScheme as useJoyColorScheme
} from '@mui/joy/styles';
// import CssBaseline from '@mui/material/CssBaseline';
import CssBaseline from '@mui/joy/CssBaseline';

const materialTheme = getMaterialTheme({
    colorSchemes: {
        dark: true
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: 'var(--joy-palette-neutral-plainColor)',
                    '&.Mui-focused': {
                    },
                    '& .MuiButtonBase-root': {
                        color: 'var(--joy-palette-primary-softColor)',
                        '&:hover': {
                            color: 'var(--joy-palette-primary-plainColor)',
                        }
                    },
                },
                notchedOutline: {
                    borderRadius: 'var(--joy-radius-md)',
                    borderColor: 'var(--joy-palette-neutral-outlinedBorder)',
                    color: 'var(--joy-palette-neutral-outlinedBorder)',
                    '.Mui-focused &': {
                        color: 'var(--joy-palette-primary-plainColor)',
                        borderColor: 'var(--joy-palette-primary-plainColor)!important',
                    },
                }
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: 'var(--joy-palette-neutral-plainColor)',
                    '&.Mui-focused': {
                        color: 'var(--joy-palette-primary-plainColor)',
                    },
                },
            },
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    color: 'var(--joy-palette-neutral-plainColor)!important',
                    '&.Mui-selected': {
                        // backgroundColor: 'var(--joy-palette-primary-plainColor)!important',     
                        backgroundColor: 'var(--joy-palette-primary-softBg)!important',     
                    },
                    '&.MuiPickersDay-today': {
                        borderColor: 'var(--joy-palette-primary-plainColor)!important',
                    },
                    '&:hover': {
                        color: 'var(--joy-palette-primary-plainColor)',
                    },
                    '&.Mui-disabled': {
                        color: 'var(--joy-palette-neutral-disabledColor)',
                    },
                },
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    '&.MuiPaper-root': {
                        borderRadius: 'var(--joy-radius-md)',
                        color: 'var(--joy-palette-neutral-softColor)',
                        backgroundColor: 'var(--joy-palette-neutral-softBg)',
                        '& .MuiPickersYear-yearButton.Mui-selected': {
                            backgroundColor: 'var(--joy-palette-primary-plainColor)',
                        },
                    },
                },
            }
        },
        MuiPickersCalendarHeader: {
            styleOverrides: {
                root: {
                    color: ''
                },
                switchHeader: {
                    color: 'var(--joy-palette-neutral-plainColor)',
                    backgroundColor: 'var(--joy-palette-neutral-softBg)',
                },
            },
        },

    }
});



import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { BorderColor } from '@mui/icons-material';
import { colors } from '@mui/material';
import { lightBlue, purple, teal } from '@mui/material/colors';
import { root } from 'postcss';

// const ThemeModeContext = createContext();




const joyTheme = getJoyTheme({
    cssVarPrefix: 'joy',
    colorSchemes: {
        dark: {
            palette: {
                primary: lightBlue,
            }
        },
        light: {
            palette: {
                primary: lightBlue,

            }
        },
    },
});

export function ModeSwitcher() {
    const { mode: mMode, setMode: setMaterialMode } = useMaterialColorScheme();
    const { mode: jMode, setMode: setJoyMode } = useJoyColorScheme();
    const [mounted, setMounted] = React.useState(false);


    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    return (
        <Select
            value={jMode}
            onChange={(event, newMode) => {
                setMaterialMode(newMode);
                setJoyMode(newMode);
            }}
        >
            <Option value="system">System</Option>
            <Option value="light">Light</Option>
            <Option value="dark">Dark</Option>
        </Select>
    );
}

export const MUIThemeProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <MaterialThemeProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
            {children}
        </MaterialThemeProvider>
    )
}
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <MUIThemeProvider>
            <JoyCssVarsProvider theme={joyTheme}>
                <CssBaseline enableColorScheme />
                {children}
            </JoyCssVarsProvider>
        </MUIThemeProvider>
    )
}