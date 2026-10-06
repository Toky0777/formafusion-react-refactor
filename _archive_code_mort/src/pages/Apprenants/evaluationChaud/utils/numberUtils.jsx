export function number_format(number, decimals = 0, dec_point = '.', thousands_sep = ',') {
    // Convert the number to a string
    let n = number.toString();
    
    // Split the number into integer and decimal parts
    let [integerPart, decimalPart] = n.split('.');
    
    // Format the integer part with thousands separator
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);
    
    // If decimals are specified, format the decimal part
    if (decimals > 0) {
        decimalPart = (decimalPart || '').padEnd(decimals, '0').slice(0, decimals);
        return `${integerPart}${dec_point}${decimalPart}`;
    }
    
    return integerPart;
}