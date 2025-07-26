// export let socket = new WebSocket( `ws://${window.location.hostname}:3005`);
// export function connect(): Promise<WebSocket> {
//     return new Promise((resolve, reject) => {
//         try {
//             socket = new WebSocket(`ws://${window.location.hostname}:3005`);
//             socket.onopen = () => resolve(socket);
//             socket.onerror = () => reject();
//         } catch (e) {
//             reject(e);
//         }
//     });
// }