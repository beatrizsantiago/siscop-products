import { render, screen, fireEvent, act } from '@testing-library/react';
import { useProductContext } from '../../../../src/App/context';
import Search from '../../../../src/App/Main/components/Search';

jest.mock('../../../../src/App/context', () => ({
  useProductContext: jest.fn(),
}));

describe('<Search />', () => {
  const onSearchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useProductContext as jest.Mock).mockReturnValue({
      onSearch: onSearchMock,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render search input and call onSearch after debounce', () => {
    render(<Search />);

    const input = screen.getByPlaceholderText(/Pesquisar produto/i);

    fireEvent.change(input, { target: { value: 'tomate' } });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onSearchMock).toHaveBeenCalledWith('tomate');
    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });

  it('should reset the debounce timer on fast typing', () => {
    render(<Search />);

    const input = screen.getByPlaceholderText(/Pesquisar produto/i);

    fireEvent.change(input, { target: { value: 'to' } });
    act(() => jest.advanceTimersByTime(500));
    fireEvent.change(input, { target: { value: 'tom' } });
    act(() => jest.advanceTimersByTime(500));
    fireEvent.change(input, { target: { value: 'toma' } });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onSearchMock).toHaveBeenCalledTimes(1);
    expect(onSearchMock).toHaveBeenCalledWith('toma');
  });
});
