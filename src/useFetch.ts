import { useEffect, useState } from 'react';

interface fetchParams {
	params: { _limit: number };
}

export function useFetch(url: string) {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	function refetch(paramsObj: fetchParams) {
        console.log(paramsObj)
    }

	useEffect(() => {
		setIsLoading(true);
		setError(false);
		fetch(url)
			.then((responseJson) => {
				if (!responseJson.ok) {
					setIsLoading(false);
					setError(true);
					return;
				}
				return responseJson.json();
			})
			.then((response) => {
				setIsLoading(false);
				setError(false);
				setData(response);
			})
			.catch(() => {
				setIsLoading(false);
				setError(true);
			});
	}, [url]);

	return {
		data,
		isLoading,
		error,
		refetch
	};
}
