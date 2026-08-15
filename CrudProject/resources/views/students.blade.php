<html>
    <h1 align="center">Hello Students Testing</h1>

    @foreach($students as $student){
        <p>{{ $student->name }}</p>

        <a
            href="{{ route('students.edit', $student->id) }}"
        >Edit</a>
     
        <form action="{{ route('students.destroy', $student->id }}"
            method="POST"
        >
            @csrf
            @method('DELETE')
            <button
                type='submit'
                onclick = "return confirm('Are U Sure?')"
            >
                Delete
            </button>
        </form>
    }

    @empty

    <h1>No Students Found</h1>

    
    @endforeach


    @if(isset($student))
            
        <form action="{{ route('students.update', $student->id) }}" method='POST'>
            @csrf
            @method('PUT')

            <div>
                <label>Name</label>
                <input type="text" name="name" 
                value="{{ old('name', $student->name) }}" />

                @error('name')
                    <span>{{ $message }}</span>
                @enderror
            </div>

            <div>
                <label>Email</label>
                <input type="email" name="email"
                 value="{{ old('email', $student->email) }}" />

                @error('email')
                    <span>{{ $message }}</span>
                @enderror
            </div>

            <div>
                <label>Age</label>
                <input type="number" name="age" 
                value="{{ old('age', $student->age) }}" />

                @error('age')
                    <span>{{ $message }}</span>
                @enderror
            </div>

            <button type="submit">Create Student</button>

            @if(session('success'))
                <p>{{ session('success') }}</p>
            @endif

        </form>
    @else
    @endif
    <form action="{{ route('students.create') }}" method='POST'>
        @csrf
        <div>
            <label>Name</label>
            <input type="text" name="name" value="{{ old('name') }}" />

            @error('name')
                <span>{{ $message }}</span>
            @enderror
        </div>

        <div>
            <label>Email</label>
            <input type="email" name="email" value="{{ old('email') }}" />

            @error('email')
                <span>{{ $message }}</span>
            @enderror
        </div>

        <div>
            <label>Age</label>
            <input type="number" name="age" value="{{ old('age') }}" />

            @error('age')
                <span>{{ $message }}</span>
            @enderror
        </div>

        <button type="submit">Create Student</button>

        @if(session('success'))
            <p>{{ session('success') }}</p>
        @endif

    </form>
</html>