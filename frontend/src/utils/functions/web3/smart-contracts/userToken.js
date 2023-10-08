import getAllTokens from "../../../api/get/getAllTokens";

export default async function getTokensQuantity() {
    const { projects } = await getAllTokens();
}
