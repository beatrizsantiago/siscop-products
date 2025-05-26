import { render, screen } from '@testing-library/react';
import Main from '../../../src/App/Main';

jest.mock('../../../src/App/List', () => () => <div data-testid="list-component" />);
jest.mock('../../../src/App/Add', () => () => <div data-testid="add-component" />);
jest.mock('../../../src/App/Main/components/Search', () => () => <div data-testid="search-component" />);

describe('<Main />', () => {
  it('should render Search, Add and List components', () => {
    render(<Main />);

    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByTestId('add-component')).toBeInTheDocument();
    expect(screen.getByTestId('list-component')).toBeInTheDocument();
  });
});
