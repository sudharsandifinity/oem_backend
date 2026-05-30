const buildSapQuery = (query = {}) => {

    const mapping = {
        select: '$select',
        filter: '$filter',
        orderBy: '$orderby',
        skip: '$skip',
        top: '$top'
    };

    const queryParams = Object.entries(mapping)
        .filter(([key]) =>
            query[key] !== undefined &&
            query[key] !== null &&
            query[key] !== ''
        )
        .map(([key, odataParam]) =>
            `${odataParam}=${encodeURIComponent(query[key])}`
        );

    return queryParams.length
        ? `?${queryParams.join('&')}`
        : '';
};

module.exports = buildSapQuery;