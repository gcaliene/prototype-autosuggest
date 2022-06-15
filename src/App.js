import * as React from 'react';
import {TextField, Button, Dialog} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { parseLocation } from 'parse-address'

export default function AddressAutoSuggest() {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [selectedOption, setSelectedOption] = React.useState({})
    // const [loaded, setLoaded] = React.useState(false)
    // const loading = open && options.length === 0;

    const hasAddressLabel = (location) => {
        if(location.address && location.address.label !== undefined && location.address.label.length !== 0) {
            return {
                label:location.address.label,
                parsed: parseLocation(location.address.label.replace(',', ''))
            }
        }
    }

    const appendSpace = (string) => string?.length > 0 ? string + ' ' :  '';

    const joinAddressLineOne = ({number = '', prefix = '', street = '', type = ''}) => {
        return `${appendSpace(number)}${appendSpace(prefix)}${appendSpace(street)}${type}`.trim();
    }

    const onChangeHandleUncontrolled = (e, type) => {
        console.log(e.target.value, type)
        setSelectedOption({...selectedOption, [type]: e.target.value})
    }

    const onChangeHandle = async value => {
// this default api does not support searching but if you use google maps or some other use the value and post to get back you result and then set it using setOptions
        console.log(value);
        console.log(options)
            const response = await fetch(
                `${process.env.REACT_APP_HERE_AUTOSUGGEST_SEARCH_API}?in=countryCode:USA&q=${value}&at=37.0902,95.7129&apiKey=${process.env.REACT_APP_HERE_API_KEY}`,
            );
            const { items } = await response.json();
            // console.log(items);
            // setLoaded()
        if (items !== undefined || items.length !== 0) {
            setOptions(items.map(hasAddressLabel));
        }


    };

    const handleClickOpen = () => {

    }
    // React.useEffect(() => {
    //     if (!open) {
    //         setOptions([]);
    //     }
    //     console.log({useEffect: selectedOption})
    // }, [open]);
    return (
        <>
            <Autocomplete
                // value={}
                id="asynchronous-demo"
                style={{ width: 300 }}
                open={open}
                freeSolo={true}
                filterOptions={(options) => options} // Autocomplete does its own filtering, taking this out
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {

                    setOpen(false);
                }}
                getOptionSelected={(option, value) => {
                    // console.log({option: option.label, value: value.label})
                    return option.label === value.label
                }}
                renderOption={(option, {selected}) => {
                    // console.log(option?.label, selected)
                    return (<>{option?.label}</>)
                }}
                getOptionLabel={option => {
                    // console.log(options, options.length)
                    console.log(option?.label)
                    // setSelectedOption(option?.parsed)
                    return joinAddressLineOne(option?.parsed);
                    // return option?.parsed;
                }}
                onChange={(event, {parsed}) => setSelectedOption(parsed) }
                options={options}
                renderInput={params => {
                    console.log(selectedOption)
                    params.inputProps.autoComplete = "new-password";

                    return (

                    <TextField
                        {...params}
                        style={{marginTop: "20px"}}
                        label="Address Line 1"
                        variant="outlined"
                        onChange={ev => {
                            // dont fire API if the user delete or not entered anything
                            if (ev.target.value !== "" || ev.target.value !== null) {
                                onChangeHandle(ev.target.value);
                            }
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {/*{loading ? (*/}
                                    {/*    <CircularProgress color="inherit" size={20} />*/}
                                    {/*) : null}*/}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            )
                        }}
                    />
                )}}
            />
            <span>
                <TextField
                    value={selectedOption?.city ?? ""}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                        autoComplete: 'new-password',
                        form: {
                            autocomplete: 'off',
                        },
                    }}
                    type={"text"}
                    label="City"
                    placeholder="City"
                    variant="outlined"
                    onChange={e => onChangeHandleUncontrolled(e, 'city')}
                />
                <TextField
                    value={selectedOption?.state ?? ""}
                    inputProps={{
                        autoComplete: 'new-password',
                        form: {
                            autocomplete: 'off',
                        },
                    }}
                    InputLabelProps={{ shrink: true }}
                    label="State"
                    placeholder="State"
                    variant="outlined"
                    onChange={e => onChangeHandleUncontrolled(e, 'state')}
                />
                <TextField
                    value={selectedOption?.zip ?? ""}
                    inputProps={{
                        autoComplete: 'new-password',
                        form: {
                            autocomplete: 'off',
                        },
                    }}
                    InputLabelProps={{ shrink: true }}
                    label="Zip"
                    placeholder="Zip"
                    variant="outlined"
                    onChange={e => onChangeHandleUncontrolled(e, 'zip')}
                />
            </span>
            {/*<br/><br/>*/}
            {/*<Button variant="contained" color="primary" onClick={handleClickOpen}>*/}
            {/*    Submit*/}
            {/*</Button>*/}
        </>
    );
}