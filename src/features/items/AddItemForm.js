import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit'
import { addNewItem } from './itemsSlice'

export const AddItemForm = () => {
    const [title, setTitle] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const dispatch = useDispatch();

    const onTitleChanged = e => setTitle(e.target.value);

    const canSave = 
        [title].every(Boolean) && addRequestStatus === 'idle'
    
    const onSaveItemClicked = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                const resultAction = await dispatch(
                    addNewItem({ title })
                )
                unwrapResult(resultAction)
                setTitle('')
            } catch (err) {
                console.error('Failed to save the item: ', err)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    return (
        <section>
            <h2>Add a New Item</h2>
            <form>
                <label htmlFor="itemTitle">Item Title:</label>
                <input
                    text="text"
                    id="itemTitle"
                    name="itemTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <button type="button" onClick={onSaveItemClicked} disabled={!canSave}>
                    Save Item
                </button>
            </form>
        </section>
    )
}
