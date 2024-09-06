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
                    '.Mui-focused &': {
                        borderColor: 'var(--joy-palette-primary-plainColor)!important',
                    },
                }
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-focused': {
                        color: 'var(--joy-palette-primary-plainColor)',
                    },
                },
            },
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: 'var(--joy-palette-primary-plainColor)!important',
                    },
                },
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    '&.MuiPaper-root': {
                        borderRadius: 'var(--joy-radius-md)',
                        '& .MuiPickersYear-yearButton.Mui-selected': {
                            backgroundColor: 'var(--joy-palette-primary-plainColor)',
                        },
                    },
                },
            }
        }
    }
});



import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { BorderColor } from '@mui/icons-material';
import { colors } from '@mui/material';
import { lightBlue, purple, teal } from '@mui/material/colors';

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