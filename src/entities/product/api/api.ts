import type {
  NomenclatureListResponse,
  NomenclatureQueryParams,
} from '../types/types';

export async function getProducts(
  _params: NomenclatureQueryParams = {}
): Promise<NomenclatureListResponse> {
  return {
    result: [],
    count: 0,
  };
}
