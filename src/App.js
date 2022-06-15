import * as React from 'react';
import TextField from '@material-ui/core/TextField';
// import Stack from '@material-ui/core/Stack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { parseLocation } from 'parse-address'
// import CircularProgress from "@material-ui/core/CircularProgress";

export default function FreeSolo() {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [selectedOption, setSelectedOptions] = React.useState({})
    // const [loaded, setLoaded] = React.useState(false)
    // const loading = open && options.length === 0;

    const hasAddressLabel = (location, index) => {
        // console.log(location,index)
        if(location.address && location.address.label !== undefined && location.address.label.length !== 0) {
            // console.log(index, location, location.address.label)
            console.log(location.address.label, parseLocation(location.address.label.replace(',', '')))
            return location.address.label
        }
    }

    const onChangeHandle = async value => {
// this default api does not support searching but if you use google maps or some other use the value and post to get back you result and then set it using setOptions
        console.log(value);

            const response = await fetch(
                `${process.env.REACT_APP_HERE_AUTOSUGGEST_SEARCH_API}?in=countryCode:USA&q=${value}&at=37.0902,95.7129&apiKey=${process.env.REACT_APP_HERE_API_KEY}`,
            );
            const {items} = await response.json();
            // console.log(items);
            // setLoaded()
        if (items !== undefined || items.length !== 0) {
            // console.log(items.filter((hasAddressLabel)));
            setOptions(items.filter(hasAddressLabel));
        }

    };

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);
    return (
        <>
            <Autocomplete
                id="asynchronous-demo"
                style={{ width: 300 }}
                open={options.length > 0 && open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                getOptionSelected={(option, value) => {
                    console.log({option, value})
                    return option.name === value.name
                }}
                getOptionLabel={option => {
                    // console.log(options)
                    // console.log(option)
                    return option.address.label
                }}
                options={options}
                // loading={loading}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Asynchronous"
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
                )}
            />
        </>
    );
}