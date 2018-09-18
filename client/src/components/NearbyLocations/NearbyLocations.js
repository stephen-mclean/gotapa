import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import List from '../platform/List';
import StopInfo from '../StopInfo/StopInfo';
import StopModel from '../../models/Stop';
import Loading from '../Loading/Loading';
import IconMessage from '../IconMessage/IconMessage';
import InfoMessage from '../InfoMessage/InfoMessage';
import Button from '../platform/Button';

const POSITION_UNAVAILABLE = 2; 
const POSITION_TIMEOUT = 3; 

const TitleContainer = styled.label`
    display: block; 
    font-weight: bold; 
    margin-top: 0.5rem; 
`;

const LocationsRenderBy = ({ ...otherProps, item }) => {
    return (
        <li {...otherProps}><StopInfo {...item} /></li>
    );
};

class NearbyLocations extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            locations: [], 
            loading: false,
            error: false, 
            geolocationAllowed: false, 
            geolocationSupported: !!navigator.geolocation 
        };

        this.tryToEnableLocation = this.tryToEnableLocation.bind(this);
        this.onLocationClicked = this.onLocationClicked.bind(this);
    }

    tryToEnableLocation() {
        const options = {
            timeout: 5000
        };

        this.setState({ loading: true });
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({ geolocationAllowed: true});
            const { latitude, longitude } = position.coords; 
            fetch(`/api/search/nearby?latitude=${latitude}&longitude=${longitude}&limit=5`)
                .then(response => response.json())
                .then(data => {
                    const mappedLocations = data.map(stop => new StopModel(stop));
                    this.setState({ locations: mappedLocations, loading: false });
                });
        }, error => {
            if (error.code === POSITION_UNAVAILABLE || error.code === POSITION_TIMEOUT) {
                this.setState({ loading: false, error: true });
            }
        }, options);
    }

    onLocationClicked(item) {
        this.props.history.push(`/stops/${item.stopId}`);
    }

    render() {

        if (!this.state.geolocationSupported) {
            return null; 
        }

        const title = <TitleContainer>Nearby Locations</TitleContainer>;

        if (this.state.loading) {
            return (
                <div>
                    {title}
                    <Loading message="Loading nearby locations..." />
                </div>
            );
        } else if (!this.state.geolocationAllowed) {
            return (
                <div>
                    {title}
                    <InfoMessage>
                        <Button onClick={this.tryToEnableLocation} link>
                            Click here
                        </Button> to show nearby locations.
                    </InfoMessage>
                </div>
            );
        } else if (this.state.locations && this.state.locations.length) {
            return (
                <div>
                    {title}
                    <List items={this.state.locations} 
                          renderBy={LocationsRenderBy} 
                          useKey="stopId" onItemClick={this.onLocationClicked} />
                </div>
            );
        } else if (this.state.error) {
            return (
                <div>
                    {title}
                    <IconMessage icon="exclamation-triangle" message="Something went wrong loading nearby locations..." />
                </div>
            ); 
        } else {
            return (
                <div>
                    {title}
                    <IconMessage icon="exclamation-triangle" message="No nearby locations found." />
                </div>
            );
        }

    }

};

export default withRouter(NearbyLocations); 