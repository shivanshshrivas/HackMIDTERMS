export default function Loading(props) {
    return (
        <div className="loading-container" style={{'display': props.show ? 'inline-block': 'none'}}>
            <div className="loading" >

            </div>
        </div>

    );
}