import React from 'react';
import withAllSubscriptions from '../../layouts/AllSubscriptionsHOC';
import ManageHaccWidget from '../../components/administrator/ManageHaccWidget';

const ConfigureHaccPage = () => (
    <ManageHaccWidget/>
);

export default withAllSubscriptions(ConfigureHaccPage);
