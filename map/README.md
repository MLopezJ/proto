# Visualizing arbitrary device data on `hello.nrfcloud.com/map`

This folder defines data models that allow anyone to register a device model and
then describe the data the model is publishing using LwM2M object definitions
([example](./lwm2m/14201.xml)).

LwM2M object definitions are shared between models and can be re-used.

Data from devices is received via nRF Cloud (using the Message Bridge), and
devices have to use the shadow update API or messaging API to publish their
data.

Devices can publish data using
[SenML](https://datatracker.ietf.org/doc/html/rfc8428) directly, which needs to
map to the defined LwM2M objects ([example](./SenMLSchema.spec.ts)).

Optionally, a set of [JSONata](https://jsonata.org/) expression can be defined
per model which allow to convert from the JSON data format that is published by
the devices to the SenML data format required by the data store
([example mapping](./model/PCA20035+solar/shadow/location.jsonata),
[result](./model/PCA20035+solar/shadow/location.result.example.json) when using
[this shadow](./model/PCA20035+solar/shadow/location.input.example.json)).

The data store will expand the SenML payload and store it under the deviceID,
and the respective object and resource ID, binned to 10 minutes.

## Model definition rules

- **device models** are identified using a model name, for example
  `PCA20035+solar`
- a [`README.md`](./model/PCA20035+solar/README.md) must be provided that
  describes the model
- the front-matter in the `README.md` must follow
  [the `ModelInfo` schema defined in `./model/model.ts`](./model/model.ts)
- transforms may define transforms that convert the data sent by the device
  using JSONata in one or more Markdown files int the `shadow` folder
  ([Example](./model/PCA20035+solar/shadow/location.md)):
  - The `Match Expression` the must evaluate to `true` for the
    `Transform Expression` to be applied to the input message
  - an `Input Example` and a `Result Example` must be supplied to validate the
    expression
  - The message must be transformed to SenML

The conformity to the rules is checked using the script
[`./check-model-rules.ts`](./check-model-rules.ts).

## LwM2M rules

- LwM2M objects are defined in the ID range from `14200` to `15000`
  (non-inclusively).
- The URN must have the prefix `urn:oma:lwm2m:x:`.
- The object version must be appended if it is not `1.0`
- All objects must define one timestamp property.

The conformity to the rules is checked using the script
[`./check-lwm2m-rules.ts`](./check-lwm2m-rules.ts).

## SenML rules

- Use the object ID as the **base name** `bn`, `urn:oma:lwm2m:x:` must be
  omitted.
- `bn` and `n` are joined using `:`, therefore `bn` should only contain the
  object ID
- The LwM2M object ID in `bn` and the resource ID in `n` are expressed as a
  number.
- Use the custom property `blv` to specify the object version, `1.0` is the
  default and should not be specified.
- Timestamps are to be expressed in the **base time** property `bt` and are
  mapped to the LwM2M object's timestamp property and must not be send as a
  property.

## Data rules

- Published **device messages** must not be older than 7 days
- Device data will be removed after 30 days
- Devices must not send more than 200 messages per day (in average ~1 message
  every 10 minutes).
- Data history resolution will be 10 minutes, updates are not possible.
- Real-time interactivity is not supported.
