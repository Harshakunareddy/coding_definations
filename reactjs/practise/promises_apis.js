const callback_api = (callback) => {
    fetch("https://www.google.com?a=1")
        .then((res) => res.json())
        .then((data) => {
            callback(data);
        });
};


const promise_api = () => {
    fetch("https://an_api_url.com")
        .then((res) => res.json())
        .then((data) => {
            setData(data);
        }).catch((err) => console.error(err));
};

const async_api = async () => {
    try {
        const res = await fetch("https://api_url.com");
        const data = await res.json();
        setData(data);
    } catch (err) {
        console.error(err);
    }
}



const axios_api = () => {
    // same try catch => axios.get('url')
    // direct no need .json here
}


