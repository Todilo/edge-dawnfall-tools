import { squadTypes as rawSquadTypes } from "./squadTypes.data.js";

import type { Squad } from "./types";

export const squadTypes = rawSquadTypes as Squad[];
