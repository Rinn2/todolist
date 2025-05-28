import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CategoryList from '../CategoryList';
import '@testing-library/jest-dom';

describe('CategoryList Component', () => {
  it('menampilkan daftar kategori yang diberikan', () => {
    const dummyCategories = [
      { id: 1, name: 'Work' },
      { id: 2, name: 'Personal' }
    ];

    render(<CategoryList categories={dummyCategories} />);

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });

  it('menampilkan pesan jika tidak ada kategori', () => {
    render(<CategoryList categories={[]} />);
    expect(screen.getByText(/no categories/i)).toBeInTheDocument();
  });
});
