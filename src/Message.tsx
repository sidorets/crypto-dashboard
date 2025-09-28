
function Message() {
    const name = 'Kirill';
    if (name) return <h1>hey {name}</h1>
    return <h1>hey stranger</h1>;
}

export default Message;