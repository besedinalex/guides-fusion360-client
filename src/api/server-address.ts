const url = window.location.hostname;

let port;
switch (window.location.port) {
    case '3000': // Dev server
        port = ':4004';
        break;
    case '': // Has domain name
        port = '';
        break;
    default: // Has not domain name
        port = `:${window.location.port}`;
        break;
}

export const serverURL = `http://${url}${port}`;
