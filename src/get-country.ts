export default function getCountry(): Promise<null | string> {
    return fetch("/", { method: "HEAD" })
        .then(res => {
			// This header is returned by BunnyCDN and contains the IP country!
            return res.headers.get("cdn-requestcountrycode")?.toLowerCase() ?? null;
        })
}