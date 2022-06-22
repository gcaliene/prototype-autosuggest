import * as React from 'react';
import {TextField, Button, Dialog} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as _ from 'lodash';

export default function AddressAutoSuggest() {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [selectedOption, setSelectedOption] = React.useState({})

    const addressReducer = (items = []) => {
        return items.reduce((filtered, item) => {
            if(item.resultType === 'houseNumber') {
                filtered.push(item.address)
            }
            return filtered
        }, [])
    }

    const joinAddressLineOne = (arr) => {
        return arr.join(' ');
    }

    const onChangeHandleUncontrolled = (e, type) => {
        console.log(e.target.value, type)
        setSelectedOption({...selectedOption, [type]: e.target.value})
    }

    const onChangeHandle = async value => {
        console.log(value);
        console.log(options)
        if(value.length > 5){
            console.log('calling')
            const response = await fetch(`${process.env.REACT_APP_HERE_AUTOCOMPLETE_SEARCH_API}?in=countryCode:USA&q=${value}&at=37.0902,95.7129&limit=20&apiKey=${process.env.REACT_APP_HERE_API_KEY}`);
            const { items } = await response.json();
            if (items !== undefined || items.length !== 0) {
                setOptions(addressReducer(items));
            }
        }
    };

    const debouncedOnChangeHandle = React.useCallback(
        _.debounce(onChangeHandle, 600, { maxWait: 1800 }), []);

    return (
        <>
            <Autocomplete
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
                    console.log(option, selected)
                    return (<>{option?.label}</>)
                }}
                getOptionLabel={option => {
                    // console.log(options, options.length)
                    console.log(option?.label)
                    // setSelectedOption(option?.parsed)
                    return joinAddressLineOne([option?.houseNumber, option?.street]);
                    // return option?.parsed;
                }}
                onChange={(event, address) => setSelectedOption(address) }
                options={options}
                renderInput={params => {
                    // console.log(selectedOption)
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
                                debouncedOnChangeHandle(ev.target.value);
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
                    value={selectedOption?.postalCode ?? ""}
                    inputProps={{
                        autoComplete: 'new-password',
                        form: {
                            autocomplete: 'off',
                        },
                    }}
                    InputLabelProps={{ shrink: true }}
                    label=""
                    placeholder="postalCode"
                    variant="outlined"
                    onChange={e => onChangeHandleUncontrolled(e, 'postalCode')}
                />
            </span>
        </>
    );
}