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
([example mapping](./model/PCA20064/shadow/14201.jsonata),
[result](./model/PCA20064/shadow/14201.jsonata.result.json) when using
[this shadow](./model/PCA20064/examples/shadow/example.json)).

The data store will expand the SenML payload and store it under the deviceID,
and the respective object and resource ID, binned to 10 minutes.

## Model definition rules

- **device models** are identified using a model name, for example `PCA20064`
- **LwM2M objects** are defined in the ID range from `14200` to `15000`
  (non-inclusively). The URN must have the prefix `urn:oma:lwm2m:x:`
- All objects must define one timestamp property.

The conformity to the rules is checked using the script
[`./map-protocols.ts`](./map-protocol.ts).

## Data rules

- Published **device messages** must not be older than 7 days
- Device data will be removed after 30 days
- Devices must not send more than 200 messages per day (in average ~1 message
  every 10 minutes).
- Data history resolution will be 10 minutes, updates are not possible.
- Real-time interactivity is not supported.
