import { httpClient, authClient } from './api';
import { customerService } from './customerService';

export { httpClient, authClient, customerService };
export { default as customerService } from './customerService';
export { default as api } from './api';