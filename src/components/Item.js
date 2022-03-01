export default function Item(props) {
    return (
        <div className="item">
            <h2>{props.question}</h2>
            <ul className="answers">
                {props.answerElements}
            </ul>
        </div>
    )
}