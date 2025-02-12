
import { v4 } from 'uuid';

function createShortUUID(): string {
    return v4().toString().split('-')[0]
}

export { createShortUUID }