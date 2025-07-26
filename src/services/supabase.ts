// import { createClient } from "@supabase/supabase-js";


export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;


// import {socket} from "./redis";
console.log({ supabaseUrl, supabaseKey });
export const simpleFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
    const URLs = url.toString().split("v1/")[1]
    const Table = URLs.split("?")[0];
    // console.log(init?.method)
    // console.log("Table : ",URLs.split("?")[0])
    if(Table && init?.method =='GET'){
        if(["settings","profiles","user","users","token"].includes(Table)){
            return fetch(url, init);
        }else {
            if(Table.includes("rpc")){
                return fetch(url, init);
            }else if(URLs.includes("?select=")){
                return fetch(url, init);
                return fetch(`http://${window.location.hostname}:3001/`+url.toString(), init);
            }else{
                return fetch(url, init);
            }
        }
    }else{
        return fetch(url, init);
    }
     
    // if(URLs!="user"&&URLs.includes("select")){
    //     console.log("Fetching URL:", url.toString().split("v1/")[1]);
    //     const PromiseCache  = new Promise((resolve, reject) => {
    //         socket.onmessage = (event) => {
    //             const data = JSON.parse(event.data)
    //             if(data.data===url.toString()&&data.cache){
    //                 resolve(data.data);
    //             }
    //         }
    //     })
    //     socket.send(JSON.stringify({"cache": url.toString()}));
    //     PromiseCache.then((data)=>{
    //         console.log("caache")
    //         return fetch(url, init);
    //     })
    //     console.log("cached")
    //     return fetch("http://127.0.0.1:3001/"+encodeURIComponent(url.toString()), init); // Call the original fetch function
    // }else{
    //     return fetch(url, init); // Call the original fetch function
    // }
  };
export const supabase = createClient(supabaseUrl, supabaseKey,{
    global: {
        fetch: simpleFetch
    }
});

export const imageBucketName = "wild-oasis-images";

// export default supabase;


export const supabase2 = createClient(supabaseUrl, supabaseKey, {
    auth:{
        storageKey: "s1",
    },
    });
function createClient(supabaseUrl: string, supabaseKey: string, arg2: { global: { fetch: (url: RequestInfo | URL, init?: RequestInit) => Promise<Response>; }; }) {
    // throw new Error("Function not implemented.");
}

