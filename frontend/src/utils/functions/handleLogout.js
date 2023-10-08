import mainUrl from "../constants/mainUrl";

export default function handleLogout() {
    window.location.href = `${mainUrl}/logout.php`
}
