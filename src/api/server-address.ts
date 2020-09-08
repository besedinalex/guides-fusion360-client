const url = window.location.hostname;

const port = () => {
    switch (window.location.port) {
        case '3000': // Dev server
            return ':4004';
        case '': // Has domain name
            return  '';
        default: // Has not domain name
            return `:${window.location.port}`;
    }
}

export const serverURL = `http://${url}${port()}`;
