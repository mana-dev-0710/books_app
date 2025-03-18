'use client';

import { useRouter } from 'next/navigation';

const DeleteModal = () => {

    const router = useRouter();

    // 詳細ページへの遷移
    const handleDetailClick = () => {
        router.push('/books/detail/1');
    };

    // 編集ページへの遷移
    const handleEditClick = () => {
        router.push('/books/edit/1');
    };

    // 削除ページへの遷移
    const handleDeleteClick = () => {
        router.push('/books/edit/1');
    };

    return (
      <>
        <label htmlFor="delete-modal" className="btn btn-error">削除</label>
  
        {/* DaisyUI のモーダル */}
        <input type="checkbox" id="delete-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">本当に削除しますか？</h3>
            <p className="py-4">この操作は元に戻せません。</p>
            <div className="modal-action">
              <label htmlFor="delete-modal" className="btn">キャンセル</label>
              <button className="btn btn-error" onClick={() => alert('削除処理実行')}>削除する</button>
            </div>
          </div>
        </div>
      </>
    );
  };

