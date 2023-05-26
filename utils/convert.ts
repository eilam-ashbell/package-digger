function url(url: string): string {
    url = url.replaceAll("/", "%2F").replaceAll(" ", "%20").replaceAll("@", "%40");
    return url;
}

export default {
    url,
}