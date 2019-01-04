import React from "react";
import "./App.css";

export class GeoPositionUseLocalState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.formData
        };
    }

    onChange = name => {
        return event => {
            this.setState(
                {
                    [name]: parseFloat(event.target.value)
                },
                () => this.props.onChange(this.state)
            );
        };
    };

    render() {
        const { lat, lon } = this.state;
        return (
            <div>
                <div>This is a simple custom field</div>
                <div>
                    <span className="input">
                        {`lat: `}
                        <input
                            type="number"
                            value={lat}
                            onChange={this.onChange("lat")}
                        />
                    </span>
                    <span className="input">
                        {`lon: `}
                        <input
                            type="number"
                            value={lon}
                            onChange={this.onChange("lon")}
                        />
                    </span>
                </div>
            </div>
        );
    }
}
