import React from "react";
import { GeoPositionUseLocalState } from "./GeoPositionUseLocalState";
import { GeoPositionUseProps } from "./GeoPositionUseProps";
import Form from "react-jsonschema-form";

const schema = {
    type: "object",
    required: [],
    properties: {
        thing: {
            type: "array",
            title: "Coordinate List - Try Reordering",
            items: {
                type: "object",
                required: [],
                properties: {
                    lat: {
                        type: "number"
                    },
                    lon: {
                        type: "number"
                    }
                }
            }
        }
    }
};

const fields = {
    geoLS: GeoPositionUseLocalState,
    geoP: GeoPositionUseProps
};

const uiSchemaLS = {
    thing: {
        items: {
            "ui:field": "geoLS"
        }
    }
};

const uiSchemaP = {
    thing: {
        items: {
            "ui:field": "geoP"
        }
    }
};

export class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: { thing: [{ lat: 10, lon: 10 }, { lat: 50, lon: 60 }] }
        };
    }

    onChange = formData => {
        this.setState({ formData });
    };

    render() {
        const { formData } = this.state;

        return (
            <>
                <h1>RJS Form Custom Field Reordering Bug Demo</h1>
                <hr />
                <p>
                    My hunch is that RJS Form has a "derived state from props"
                    issue.
                </p>
                <p>
                    If you instruct a custom field to use its own local state
                    copy of form data as the source of truth (while also passing
                    local change events up to the RJS form) then the fields will
                    not understand or register array reorderings (since the
                    reordering event is not captured in a field's local state -
                    that order state is maintained in the parent of the custom
                    field).
                </p>
                <p>
                    On the other hand, if you instruct custom fields to treat
                    the form data props it receives from its parent as the
                    source of truth, reorderings do register correctly... at
                    face value. The issue is that after a reordering if you
                    change a single property within the custom field, RJS will
                    have fundamentally lost track of which custom field is which
                    and will spit out erroneous formData on its onChange event
                    handler (essentially believing that the unchanged property
                    in the reordered custom field has the value of that prop in
                    the "pre-reordering" custom field).
                </p>
                <p>
                    What follows is a demonstration of the two approaches
                    described above. Three forms are displayed: a vanilla RJS
                    form with no custom fields, a custom field RJS form in which
                    the custom field uses its own local state as the source of
                    truth and lastly a custom field RJS form in which the custom
                    field uses the form data props it receives as the source of
                    truth.
                </p>
                <p>
                    All three forms are contained in a Container component which
                    is maintaining control over the props fed into the Form
                    components. The same form data is simultaneously fed into
                    each of the three forms so that comparisons in behavior are
                    easy to compare.
                </p>
                <div>
                    <h2>
                        This is the basic form which does not use custom fields
                        - reordering and editing work fine
                    </h2>
                </div>
                <Form
                    schema={schema}
                    fields={fields}
                    formData={formData}
                    onChange={data => this.onChange(data.formData)}
                />
                <hr />
                <div>
                    <h2>
                        This form uses custom fields and treats custom field
                        local state as source of truth - reordering does not
                        work but editing does
                    </h2>
                </div>
                <Form
                    schema={schema}
                    uiSchema={uiSchemaLS}
                    fields={fields}
                    formData={formData}
                    onChange={data => this.onChange(data.formData)}
                />
                <hr />
                <div>
                    <h2>
                        This form uses custom fields and treats parent props as
                        source of truth - reordering works but editing a
                        property after reordering into a different order than
                        the initial state leads to unexpected changes in the
                        prop not being edited by the user.
                    </h2>
                </div>
                <Form
                    schema={schema}
                    uiSchema={uiSchemaP}
                    fields={fields}
                    formData={formData}
                    onChange={data => this.onChange(data.formData)}
                />
            </>
        );
    }
}
