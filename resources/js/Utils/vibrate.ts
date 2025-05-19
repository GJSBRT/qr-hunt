export function Vibrate(duration: number) {
    if (!('vibrate' in navigator)) return;

    navigator.vibrate(duration);
}